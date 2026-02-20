//เช็คว่าผู้ใช้กรอกข้อมูลมครบไหม
export const validateRegister = (req, res, next) => {
    const { username, password, firstname, lastname } = req.body;
    const missingFields = [];

    if (!username) {
        missingFields.push('username');
    }
    if (!password) {
        missingFields.push('password');
    }
    if (!firstname) {
        missingFields.push('firstname');
    }
    if (!lastname) {
        missingFields.push('lastname');
    }

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required fields: ${missingFields.join(', ')}`,
            missingFields: missingFields
        });
    }

    next();
};

//เช็คว่ากรอก username password แล้วหรือยัง
export const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    const missingFields = [];

    if (!username) {
        missingFields.push('username');
    }
    if (!password) {
        missingFields.push('password');
    }

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required fields: ${missingFields.join(', ')}`,
            missingFields: missingFields
        });
    }

    next();
};


