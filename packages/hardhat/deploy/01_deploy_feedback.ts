import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the FeedbackForge contract using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployFeedbackForgeContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployment = await deploy("FeedbackForge", {
    from: deployer,
    log: true,
    autoMine: true, // Automatically mine the transaction on local networks
  });

  // Get the deployed contract address
  const feedbackForgeAddress = deployment.address;

  console.log("FeedbackForge contract deployed at:", feedbackForgeAddress);
};

export default deployFeedbackForgeContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags FeedbackForge
deployFeedbackForgeContract.tags = ["FeedbackForge"];
