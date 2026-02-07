"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpGenerator = otpGenerator;
function otpGenerator() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}
//# sourceMappingURL=otpGenerator.js.map