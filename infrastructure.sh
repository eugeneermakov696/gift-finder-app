helm upgrade --install gift-finder ./helm-charts/gift-finder --namespace gift-finder --create-namespace
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
if ! helm status ingress-nginx -n ingress-nginx >/dev/null 2>&1; then
    helm install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace
fi