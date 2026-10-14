const path = require("path");
const { randomUUID } = require("crypto");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("./firebase");
const { readCsv, writeReconciliation } = require("./csvUtils");
const { findDealer } = require("./dealerService");

const csvPath = path.join(__dirname, "../data/legacy_leads.csv");
const leadsCollection = db.collection("leads");

function getValue(row, ...keys) {
  for (const key of keys) {
    const found = Object.keys(row).find(
      (item) => item.toLowerCase().trim() === key.toLowerCase()
    );

    if (found && row[found] != null && String(row[found]).trim() !== "") {
      return String(row[found]).trim();
    }
  }

  return "";
}

function cleanMobile(value) {
  let mobile = String(value || "").replace(/\D/g, "");

  if (mobile.length === 12 && mobile.startsWith("91")) {
    mobile = mobile.slice(2);
  }

  return mobile;
}

async function importLegacyLeads() {
  const rows = readCsv(csvPath);
  const report = [];
  const seenMobiles = new Set();

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    const leadId =
      getValue(row, "lead_id", "id", "leadid") || `ROW-${index + 1}`;

    try {
      const name = getValue(row, "name", "lead_name", "customer_name");
      const rawMobile = getValue(row, "mobile", "phone", "mobile_number");
      const mobile = cleanMobile(rawMobile);
      const pincode = getValue(row, "pincode", "pin_code", "postal_code");
      const product = getValue(row, "product", "product_name");
      const source = getValue(row, "source", "lead_source") || "Legacy CSV";

      if (!name || !product || !/^[6-9]\d{9}$/.test(mobile) ||
          !/^\d{6}$/.test(pincode)) {
        report.push({
          lead_id: leadId,
          action: "rejected",
          reason: "Missing name/product or invalid mobile/pincode",
        });
        continue;
      }

      if (seenMobiles.has(mobile)) {
        const existing = await leadsCollection
          .where("mobile", "==", mobile)
          .limit(1)
          .get();

        if (!existing.empty) {
          await existing.docs[0].ref.set(
            {
              name,
              pincode,
              product,
              source,
              ...findDealer(pincode),
              updatedOn: FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        }

        report.push({
          lead_id: leadId,
          action: "merged",
          reason: "Duplicate mobile number within CSV",
        });
        continue;
      }

      seenMobiles.add(mobile);

      const duplicate = await leadsCollection
        .where("mobile", "==", mobile)
        .limit(1)
        .get();

      if (!duplicate.empty) {
        await duplicate.docs[0].ref.set(
          {
            name,
            pincode,
            product,
            source,
            ...findDealer(pincode),
            updatedOn: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        report.push({
          lead_id: leadId,
          action: "merged",
          reason: "Existing Firestore lead updated using matching mobile",
        });
        continue;
      }

      const dealerInfo = findDealer(pincode);
      const id = randomUUID();

      await leadsCollection.doc(id).create({
        name,
        mobile,
        pincode,
        product,
        source,
        status: "New",
        ...dealerInfo,
        legacyLeadId: leadId,
        importedFrom: "legacy_leads.csv",
        createdOn: FieldValue.serverTimestamp(),
      });

      const assignedInhouse = dealerInfo.dealer === "In-house Sales";
      const fixed =
        rawMobile !== mobile ||
        !getValue(row, "source", "lead_source");

      report.push({
        lead_id: leadId,
        action: assignedInhouse
          ? "assigned_inhouse"
          : fixed
            ? "fixed"
            : "imported",
        reason: assignedInhouse
          ? "No matching dealer for pincode; assigned to In-house Sales"
          : fixed
            ? "Data normalized and imported"
            : "Valid lead imported successfully",
      });
    } catch (error) {
      console.error(`Row ${index + 1} failed:`, error.message);

      report.push({
        lead_id: leadId,
        action: "rejected",
        reason: `Processing error: ${error.message}`,
      });
    }
  }

  const reportPath = writeReconciliation(report);

  return {
    totalRows: rows.length,
    reportedRows: report.length,
    reportPath,
  };
}

if (require.main === module) {
  importLegacyLeads()
    .then((result) => {
      console.log("Import completed:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Import failed:", error);
      process.exit(1);
    });
}

module.exports = { importLegacyLeads };