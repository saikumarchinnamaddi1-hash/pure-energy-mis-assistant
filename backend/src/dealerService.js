const path = require("path");
const { readCsv } = require("./csvUtils");

const dealerFile = path.join(__dirname, "../data/dealers.csv");

function findDealer(pincode) {
  const dealers = readCsv(dealerFile);
  const pin = String(pincode || "").trim();

  const matches = dealers
    .flatMap((dealer) => {
      const prefixes = String(dealer.pincode_prefixes || "")
        .split("|")
        .map((prefix) => prefix.trim())
        .filter(Boolean);

      return prefixes
        .filter((prefix) => pin.startsWith(prefix))
        .map((prefix) => ({ dealer, prefix }));
    })
    .sort((a, b) => b.prefix.length - a.prefix.length);

  if (matches.length === 0) {
    return {
      dealer: "In-house Sales",
      dealerId: "",
      dealerCity: "",
      dealerEmail: "",
    };
  }

  const selected = matches[0].dealer;

  return {
    dealer: selected.dealer_name,
    dealerId: selected.dealer_id,
    dealerCity: selected.city,
    dealerEmail: selected.contact_email,
  };
}

module.exports = { findDealer };