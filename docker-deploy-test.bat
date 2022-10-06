docker build --no-cache -t rems-dashboard:latest .
docker tag rems-dashboard:latest remscontainer.azurecr.io/rems-dashboard:latest
docker push remscontainer.azurecr.io/rems-dashboard:latest