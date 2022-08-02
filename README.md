# chartlink
Charlink realtime updater

#Step 1: Update the system#
Before starting, it is recommended to update the system with the latest stable release. You can do this with the following command:

sudo apt-get update -y
sudo apt-get upgrade -y
sudo shutdown -r now

#Step 2: Install PhantomJS#
Before installing PhantomJS, you will need to install some required packages on your system. You can install all of them with the following command:

sudo apt-get install build-essential chrpath libssl-dev libxft-dev libfreetype6-dev libfreetype6 libfontconfig1-dev libfontconfig1 -y
Next, you will need to download the PhantomJS. You can download the latest stable version of the PhantomJS from their official website. Run the following command to download PhantomJS:

sudo wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
Once the download is complete, extract the downloaded archive file to desired system location:

sudo tar xvjf phantomjs-2.1.1-linux-x86_64.tar.bz2 -C /usr/local/share/
Next, create a symlink of PhantomJS binary file to systems bin dirctory:

sudo ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/

#Step 3: Verify PhantomJS#
PhantomJS is now installed on your system. You can now verify the installed version of PhantomJS with the following command:

phantomjs --version
You should see the following output:
2.1.1

#Step 4: install casperjs#
npm install casperjs

#run#
casperjs bogota.js
