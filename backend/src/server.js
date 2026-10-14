require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("./firebase");
const { findDealer } = require("./dealerService");
const { importLegacyLeads } = require("./importService");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const leadsCollection = db.collection("leads");

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend connected successfully",
    });
});

app.get("/api/leads", async (req, res) => {
    try {
        const snapshot = await leadsCollection
            .orderBy("createdOn", "desc")
            .get();

        res.json({
            success: true,
            data: snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })),
        });
    } catch (error) {
        console.error("Fetch leads error:", error);
        res.status(500).json({ success: false, message: "Unable to fetch leads" });
    }
});

app.post("/api/leads", async (req, res) => {
    try {
        const name = String(req.body.name || "").trim();
        const mobile = String(req.body.mobile || "").replace(/\D/g, "");
        const pincode = String(req.body.pincode || "").trim();
        const product = String(req.body.product || "").trim();
        const source = String(req.body.source || "Website").trim();

        if (!name || !product) {
            return res.status(400).json({
                success: false,
                message: "Name and product are required",
            });
        }

        if (!/^[6-9]\d{9}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 10-digit Indian mobile number",
            });
        }

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 6-digit pincode",
            });
        }

        const duplicate = await leadsCollection
            .where("mobile", "==", mobile)
            .limit(1)
            .get();

        if (!duplicate.empty) {
            return res.status(409).json({
                success: false,
                message: "A lead with this mobile number already exists"
            });
        }

        const dealerInfo = findDealer(pincode);
        const id = randomUUID();

        const lead = {
            name,
            mobile,
            pincode,
            product,
            source,
            status: "New",
            ...dealerInfo,
            createdOn: FieldValue.serverTimestamp(),
        };

        await leadsCollection.doc(id).create(lead);

        res.status(201).json({
            success: true,
            message: "Lead saved successfully",
            data: { id, ...lead, createdOn: new Date().toISOString() },
        });
    } catch (error) {
        console.error("Create lead error:", error);
        res.status(500).json({ success: false, message: "Unable to save lead" });
    }
});

app.patch("/api/leads/:id/status", async (req, res) => {
    try {
        const allowedStatuses = ["New", "Contacted", "Converted", "Lost"];
        const status = String(req.body.status || "");

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid lead status",
            });
        }

        const doc = leadsCollection.doc(req.params.id);
        const snapshot = await doc.get();

        if (!snapshot.exists) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        await doc.update({ status });

        res.json({ success: true, message: "Lead status updated" });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ success: false, message: "Unable to update status" });
    }
});

app.post("/api/import-legacy", async (req, res) => {
    try {
        const result = await importLegacyLeads();

        res.json({
            success: true,
            message: "Legacy import completed",
            ...result,
        });
    } catch (error) {
        console.error("Import error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Import failed",
        });
    }
});

app.delete("/api/leads/:id", async (req, res) => {
    try {
        const leadRef = db.collection("leads").doc(req.params.id);
        const leadDoc = await leadRef.get();

        if (!leadDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        await leadRef.delete();

        return res.json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (error) {
        console.error("Delete lead error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete lead",
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});