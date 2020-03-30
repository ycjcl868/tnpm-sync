const { join } = require('path');
const { readdirSync, existsSync } = require('fs');

const execa = require('execa');

process.setMaxListeners(Infinity);

const isLerna = function(cwd) {
  return existsSync(join(cwd, 'lerna.json'));
}

const getSinglePkg = function(cwd) {
  try {
    const pkg = require(join(cwd, 'package.json'));
    if (pkg && pkg.name && !pkg.private) {
      return [pkg.name];
    }
  } catch (e) {};
  return [];
}

const getLernaPkgs = function(cwd) {
  return readdirSync(join(cwd, 'packages'))
    .filter((pkg) => pkg.charAt(0) !== '.')
    .map((name) => {
      const [pkg = ''] = getSinglePkg(join(cwd, 'packages', name));
      return pkg;
    })
    .filter(pkg => pkg);
}

const getPackages = function(cwd) {
  return isLerna(cwd)
    ? getLernaPkgs(cwd)
    : getSinglePkg(cwd);
};

exports.getPackages = getPackages;

module.exports = function (args) {
  const {
    cwd = process.cwd(),
    packages = [],
    command = 'tnpm sync',
    timeout = 20000,
  } = args;
  const pkgs = Array.isArray(packages) && packages.length > 0
    ? packages
    : getPackages(cwd);

  if (!pkgs.length) {
    console.log('🤔 Not found sync packages');
    process.exit(0);
  }

  console.log('🚀 Syncing packages: ');
  console.log(pkgs);
  const syncQueue = pkgs.map((pkg) => {
    const [client, syncCmd] = command.split(' ');
    const subprocess = execa(client, [syncCmd, pkg]);
    setTimeout(() => {
      // 15s timeout
      subprocess.cancel();
  }, timeout);
    subprocess.stdout.pipe(process.stdout);
    return subprocess;
  });
  Promise.all(syncQueue);
};
