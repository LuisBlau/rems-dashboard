# Installation instructions
### first time deployment
1. clone the foodland branch for both rems-dashboard and dashboard-express-server
2. install Nodejs LTS version 16.14.0, do select the option to install additional tools
3. run `npm install` in both the dashboard-express-server and rems-dashboard directorys
4. download and extract the nssm binary from nssm.cc
5. open a cmd window in the directory that you extracted the nssm binary to
6. type `./nssm install rems-dashboard`
7. Click the 3 dots next to the path option and select the start.bat file in the rems-dashboard folder.
8. click install service
9. repeat steps 5-7 for the dashboard-express-server
10. goto the Services manager and start the rems-dashboard service and the dashboard-express-server service
### Deploying new builds
1. stop the rems-dashboard service and the dashboard-express-server
2. copy or pull the new builds to the server
3. run `npm build` in the rems-dashboard directory
4. start the rems-dashboard service and the dashboard-express-server service