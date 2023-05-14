docker build --no-cache -t rems-dashboard:prod .
docker tag rems-dashboard:prod remscontainer.azurecr.io/rems-dashboard:prod
docker push remscontainer.azurecr.io/rems-dashboard:prod