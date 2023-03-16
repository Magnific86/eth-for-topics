import { expect } from "./chai-setup";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Storage } from "../typechain-types";
const StorageAbi = require("../artifacts/contracts/Storage.sol/Storage.json");
const { revertedWith } = require("@nomiclabs/hardhat-waffle");

describe("Storage Contract", () => {
  let owner: any;
  let admin: any;
  let user: any;
  let StorageAsOwner: Storage;
  let StorageAsAdmin: Storage;
  let StorageAsUser: Storage;

  beforeEach(async () => {
    await deployments.fixture(["Storage"]);

    ({ owner, admin, user } = await getNamedAccounts());

    StorageAsOwner = await ethers.getContract<Storage>("Storage", owner);
    StorageAsAdmin = await ethers.getContract<Storage>("Storage", admin);
    StorageAsUser = await ethers.getContract<Storage>("Storage", user);
  });

  it("Sets correct owner", async () => {
    expect(await StorageAsOwner.owner()).to.eq(owner);
  });

  describe("admin describe", () => {
    it("make any user admin makeAdmin()", async () => {
      expect(await StorageAsUser.admins(user)).to.eq(false);
      const tx = await StorageAsUser.makeAdmin(user);
      await tx.wait();
      expect(await StorageAsUser.admins(user)).to.eq(true);
    });
    it("not allow to make admin another address", async () => {
      await expect(StorageAsAdmin.makeAdmin(user)).to.be.revertedWith(
        "Why you indicate another address"
      );
    });
    it("remove any user admin only owner removeAdmin()", async () => {
      await (await StorageAsUser.makeAdmin(user)).wait();
      expect(await StorageAsOwner.admins(user)).to.eq(true);
      const tx = await StorageAsOwner.removeAdmin(user);
      await tx.wait();
      expect(await StorageAsOwner.admins(user)).to.eq(false);
    });
    // it("doesnt allows to buy, invalid sum", async () => {
    //   await addAlbum();
    //   await expect(Storage.buy(0, 3, { value: 200 })).to.be.revertedWith(
    //     "Invalid price!"
    //   );
    // });
  });
});
