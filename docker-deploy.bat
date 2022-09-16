docker build --no-cache -t rems-dashboard .
docker tag rems-dashboard remscontainer.azurecr.io/rems-dashboard
docker push remscontainer.azurecr.io/rems-dashboard