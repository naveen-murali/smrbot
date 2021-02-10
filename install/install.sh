sudo apt-get update
sudo apt-get upgrade
sudo apt-get install --no-install-recommends xserver-xorg x11-xserver-utils xinit openbox
sudo apt-get install --no-install-recommends chromium-browser
sudo pip3 install django
sudo pip3 install pymongo
sudo pip3 install dnspython
sudo pip3 install Rpi.GPIO
sudo echo "#xset x off 
#xset x noblank 
#xset -dpms
#xmodmap -pke
#xmodmap -e 'keycode 64 = '
#xmodmap -e 'keycode 108 = '
#chromium-browser --noerrdialogs --disable-infobars --kiosk 'http://127.0.0.1:3000' &
chromium-browser --kiosk “http://127.0.0.1:3000” &" >> /etc/xdg/openbox/autostart
