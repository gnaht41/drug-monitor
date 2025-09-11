// middleware/validateDrug.js
module.exports = function validateDrug(req, res, next) {
    const { name, dosage, card, pack, perDay } = req.body;

    // a. Name length > 5
    if (!name || name.length <= 5) {
        return res.status(400).json({ message: "Name must be longer than 5 characters." });
    }

    // b. Dosage format: XX-morning,XX-afternoon,XX-night
    // e.g., "10-morning,5-afternoon,2-night"
    const dosageRegex = /^(\d+)-morning,(\d+)-afternoon,(\d+)-night$/;
    if (!dosageRegex.test(dosage)) {
        return res.status(400).json({
            message: "Dosage must follow format: XX-morning,XX-afternoon,XX-night (X is a digit)."
        });
    }

    // c. Card > 1000
    if (typeof card !== "number" || card <= 1000) {
        return res.status(400).json({ message: "Card must be more than 1000." });
    }

    // d. Pack > 0
    if (typeof pack !== "number" || pack <= 0) {
        return res.status(400).json({ message: "Pack must be more than 0." });
    }

    // e. PerDay > 0 and < 90
    if (typeof perDay !== "number" || perDay <= 0 || perDay >= 90) {
        return res.status(400).json({ message: "PerDay must be more than 0 and less than 90." });
    }

    // If all checks pass
    next();
};
