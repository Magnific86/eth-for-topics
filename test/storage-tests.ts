import { expect } from "./chai-setup";
import { ethers, deployments, getNamedAccounts } from "hardhat";
import { Storage } from "../typechain-types";
const StorageAbi = require("../artifacts/contracts/Storage.sol/Storage.json");
import sha256 from "sha256";

describe("Storage Contract", () => {
  let ownerGlob: any;
  let adminGlob: any;
  let userGlob: any;
  let StorageAsOwner: Storage;
  let StorageAsAdmin: Storage;
  let StorageAsUser: Storage;
  const hashNotString = sha256("question" + "answer" + "category");
  const hash = String(hashNotString);

  beforeEach(async () => {
    await deployments.fixture(["Storage"]);

    const { owner, admin, user } = await getNamedAccounts();
    ownerGlob = owner;
    adminGlob = admin;
    userGlob = user;

    StorageAsOwner = await ethers.getContract<Storage>("Storage", ownerGlob);
    StorageAsAdmin = await ethers.getContract<Storage>("Storage", adminGlob);
    StorageAsUser = await ethers.getContract<Storage>("Storage", userGlob);

    const txToMakeAdmin = await StorageAsAdmin.makeAdmin(admin);
    await txToMakeAdmin.wait();
  });

  it("Sets correct owner", async () => {
    expect(await StorageAsOwner.owner()).to.eq(ownerGlob);
  });
  it("Also sets owner to be admin", async () => {
    expect(await StorageAsOwner.admins(ownerGlob)).to.eq(true);
  });

  describe("admin describe", () => {
    it("make any user admin makeAdmin()", async () => {
      expect(await StorageAsUser.admins(userGlob)).to.eq(false);
      const tx = await StorageAsUser.makeAdmin(userGlob);
      await tx.wait();
      expect(await StorageAsUser.admins(userGlob)).to.eq(true);
    });
    // it("not allow to make admin another address", async () => {
    //   //@ts-ignore
    //   await expect(StorageAsAdmin.makeAdmin(userGlob)).to.be.revertedWith(
    //     "Why you indicate another address"
    //   );
    // });
    it("remove any user admin only owner removeAdmin()", async () => {
      await (await StorageAsUser.makeAdmin(userGlob)).wait();
      expect(await StorageAsOwner.admins(userGlob)).to.eq(true);
      const tx = await StorageAsOwner.removeAdmin(userGlob);
      await tx.wait();
      expect(await StorageAsOwner.admins(userGlob)).to.eq(false);
    });

    // it("doesnt allows to buy, invalid sum", async () => {
    //   await addAlbum();
    //   await expect(Storage.buy(0, 3, { value: 200 })).to.be.revertedWith(
    //     "Invalid price!"
    //   );
    // });
  });
  describe("postHash funcs", () => {
    it("allow to post hash by admin", async () => {
      const tx = await StorageAsAdmin.addPostHash(hash);
      await tx.wait();

      expect((await StorageAsAdmin.index()).toString()).to.eq("2");
      expect(await StorageAsAdmin.postsHashes(0)).to.eq(hash);
    });
    it("delete post hash", async () => {
      const tx = await StorageAsAdmin.addPostHash(hash);
      await tx.wait();

      const deleteTx = await StorageAsAdmin.deletePostHash(hash);
      await deleteTx.wait();
      expect(await StorageAsAdmin.postsHashes(0)).to.eq("");
    });
  });
});
