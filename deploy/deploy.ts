import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;

  const { owner } = await getNamedAccounts();

  await deploy("Storage", {
    from: owner,
    log: true,
  });
};

export default func;
func.tags = ["Storage"];
