const fs = require("fs");
const path = require("path");

const GitClient = require("./git/client");

// commands
const { CatFileCommand, HashObjectCommand } = require("./git/commands");

//console.error("Logs from your program will appear here!");

const gitClient = new GitClient();
const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCatFileCommand();
    break;
  case "hash-object":
    handleHashObjectCommand();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(
    path.join(process.cwd(), ".git", "HEAD"),
    "ref: refs/heads/main\n"
  );
  console.log("Initialized git directory");
}

function handleCatFileCommand() {
  const flag = process.argv[3];
  const commitSHA = process.argv[4];

  const command = new CatFileCommand(flag, commitSHA);
  gitClient.run(command);

  // console.log(`cat-file command received with flag: ${flag} and commit SHA: ${commitSHA}`);
}

function handleHashObjectCommand() {
    let flag = process.argv[3];
    let filePath = process.argv[4];

    if(!filePath){
        filePath = flag;
        flag = null
    }

    const command = new HashObjectCommand(flag, filePath);
    gitClient.run(command);
}