import axios from "axios";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getPackageInfo(packageName) {
  const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
  return response.data;
}

let successCount = 0;

async function downloadTarball(tarballUrl, idx = 0) {
  await sleep(idx * 10);
  await axios(tarballUrl);

  successCount++;

  console.log(`[${idx + 1}] Successfully downloaded!`);
}

async function spamPackageDownload(packageName, count) {
  try {
    // Get package info from npm registry
    const packageInfo = await getPackageInfo(packageName);
    const latestVersion = packageInfo["dist-tags"].latest;
    const tarballUrl = packageInfo.versions[latestVersion].dist.tarball;

    const responses = [];

    for (let i = 0; i < count; i++) {
      responses.push(downloadTarball(tarballUrl, i));
    }

    await Promise.all(responses);

    console.log(successCount, "/", count, "downloads completed!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const arg = process.argv[2];
const downloadcCount = arg ? parseInt(arg) : getRandomInt(10_000, 15_000);

spamPackageDownload("react-pre-hooks", downloadcCount);
