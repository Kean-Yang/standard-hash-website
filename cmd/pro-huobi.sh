yarn heco:build
ssh df-sg "
  rm -rf /var/www/standard-hash-website
  exit
"
cd ..
chmod -R 775 ./build
scp -r build df-sg:/var/www/standard-hash-website
