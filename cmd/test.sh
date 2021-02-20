yarn build
ssh df-sg "
  sudo rm -rf /var/www/standard-hash-website-test
  exit
"
chmod -R 775 ./build
scp -r build df-sg:/var/www/standard-hash-website-test
