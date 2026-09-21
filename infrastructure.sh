helm upgrade --install gift-finder ./helm-charts/gift-finder --namespace gift-finder --create-namespace
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace