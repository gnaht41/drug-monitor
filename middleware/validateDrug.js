// middleware/validateDrug.js
module.exports = function validateDrug(req, res, next) {
    const { name, dosage } = req.body || {};

    // ép kiểu số (nếu là chuỗi số)
    const card = Number(req.body?.card);
    const pack = Number(req.body?.pack);
    const perDay = Number(req.body?.perDay);

    // a) Name > 5
    if (typeof name !== 'string' || name.trim().length <= 5) {
        return res.status(400).json({ message: "Name must be longer than 5 characters." });
    }

    // b) Dosage: XX-morning,XX-afternoon,XX-night
    const dosageRegex = /^(\d+)-morning,(\d+)-afternoon,(\d+)-night$/;
    if (typeof dosage !== 'string' || !dosageRegex.test(dosage)) {
        return res.status(400).json({
            message: "Dosage must follow format: XX-morning,XX-afternoon,XX-night (X is a digit)."
        });
    }

    // c) Card > 1000
    if (!Number.isFinite(card) || card <= 1000) {
        return res.status(400).json({ message: "Card must be more than 1000." });
    }
    // d) Pack > 0
    if (!Number.isFinite(pack) || pack <= 0) {
        return res.status(400).json({ message: "Pack must be more than 0." });
    }
    // e) PerDay > 0 && < 90
    if (!Number.isFinite(perDay) || perDay <= 0 || perDay >= 90) {
        return res.status(400).json({ message: "PerDay must be more than 0 and less than 90." });
    }

    // ghi đè lại body = số
    req.body.card = card;
    req.body.pack = pack;
    req.body.perDay = perDay;

    next();
};
