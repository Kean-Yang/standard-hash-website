yarn test_heco:build
ssh df-test "
  sudo rm -rf /var/www/dapp/standard-hash-website-test
  exit
"
cd ..
chmod -R 775 ./build
scp -r ./build df-test:/var/www/dapp/standard-hash-website-test


