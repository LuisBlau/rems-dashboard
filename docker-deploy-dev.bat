docker build --no-cache -t rems-dashboard:dev .
docker tag rems-dashboard:dev remscontainer.azurecr.io/rems-dashboard:dev
docker push remscontainer.azurecr.io/rems-dashboard:dev