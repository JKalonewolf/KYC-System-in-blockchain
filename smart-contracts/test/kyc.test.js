const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KYC Contract", function () {
    let KYC, kyc, admin, user1;

    beforeEach(async function () {
        [admin, user1] = await ethers.getSigners();
        KYC = await ethers.getContractFactory("KYC");
        kyc = await KYC.deploy();
        await kyc.deployed();
    });

    it("should deploy and set the admin", async function () {
        expect(await kyc.admin()).to.equal(admin.address);
    });

    it("should allow user to submit KYC", async function () {
        await kyc.connect(user1).submitKYC("QmHash");
        const record = await kyc.kycRecords(user1.address);
        expect(record.documentHash).to.equal("QmHash");
        expect(record.status).to.equal(0); // Pending
    });

    it("should allow admin to approve KYC", async function () {
        await kyc.connect(user1).submitKYC("QmHash");
        await kyc.approveKYC(user1.address);
        const record = await kyc.kycRecords(user1.address);
        expect(record.status).to.equal(1); // Approved
    });

    it("should allow user to update consent", async function () {
        await kyc.connect(user1).submitKYC("QmHash");
        await kyc.connect(user1).updateConsent(true);
        const record = await kyc.kycRecords(user1.address);
        expect(record.consentGiven).to.be.true;
    });
});
