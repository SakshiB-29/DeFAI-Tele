# DeFi AI Tracker - Kubernetes Deployment

This directory contains the Kubernetes configurations for deploying the DeFi AI Tracker application.

## Prerequisites

- Kubernetes cluster (EKS, GKE, or AKS)
- Helm v3
- kubectl
- AWS CLI (if using EKS)
- Docker

## Directory Structure

```
k8s/
├── deployment.yaml      # Main application deployments
├── secrets.yaml        # Kubernetes secrets
├── autoscaling.yaml    # HorizontalPodAutoscaler configurations
├── monitoring.yaml     # Prometheus and Grafana configurations
└── README.md          # This file
```

## Deployment Steps

1. Create a Kubernetes namespace:
   ```bash
   kubectl create namespace defai
   kubectl config set-context --current --namespace=defai
   ```

2. Install Prometheus and Grafana using Helm:
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   helm install prometheus prometheus-community/kube-prometheus-stack \
     --namespace defai \
     --set grafana.adminPassword=your-secure-password
   ```

3. Create secrets:
   ```bash
   # First, create base64 encoded values for your secrets
   echo -n "your-secret-value" | base64
   
   # Then update k8s/secrets.yaml with the base64 encoded values
   kubectl apply -f k8s/secrets.yaml
   ```

4. Deploy the application:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/autoscaling.yaml
   kubectl apply -f k8s/monitoring.yaml
   ```

5. Verify the deployment:
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

## Monitoring

The application is configured with Prometheus and Grafana for monitoring:

- Prometheus collects metrics from the application
- Grafana provides visualization of the metrics
- Alert rules are configured for:
  - High error rates (>10%)
  - High latency (>1s)
  - Low memory availability (<10%)

### Accessing Grafana

1. Port-forward the Grafana service:
   ```bash
   kubectl port-forward svc/prometheus-grafana 3000:80 -n defai
   ```

2. Access Grafana at http://localhost:3000
   - Default username: admin
   - Password: (the one you set during installation)

### Available Dashboards

1. DeFi AI Dashboard
   - Request rate
   - Error rate
   - Memory usage
   - CPU usage

## Scaling

The application is configured with HorizontalPodAutoscaler:

### Backend
- Minimum replicas: 2
- Maximum replicas: 10
- CPU target utilization: 70%
- Memory target utilization: 80%

### Frontend
- Minimum replicas: 1
- Maximum replicas: 5
- CPU target utilization: 70%
- Memory target utilization: 80%

## Maintenance

### Updating the Application

1. Build and push new Docker images
2. Update the image tags in `deployment.yaml`
3. Apply the updated configuration:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   ```

### Rolling Updates

The deployment is configured with rolling updates:
- Max surge: 25%
- Max unavailable: 25%

### Backup and Restore

1. Database backup:
   ```bash
   kubectl exec -it $(kubectl get pod -l app=defai-backend -o jsonpath='{.items[0].metadata.name}') -- pg_dump -U postgres defai > backup.sql
   ```

2. Restore database:
   ```bash
   kubectl exec -it $(kubectl get pod -l app=defai-backend -o jsonpath='{.items[0].metadata.name}') -- psql -U postgres defai < backup.sql
   ```

## Troubleshooting

1. Check pod status:
   ```bash
   kubectl get pods
   kubectl describe pod <pod-name>
   ```

2. View logs:
   ```bash
   kubectl logs <pod-name>
   kubectl logs -f <pod-name>  # Follow logs
   ```

3. Check service status:
   ```bash
   kubectl get services
   kubectl describe service <service-name>
   ```

4. Check ingress status:
   ```bash
   kubectl get ingress
   kubectl describe ingress defai-ingress
   ```

## Security Considerations

1. Secrets are stored in Kubernetes secrets
2. TLS is enabled for all ingress traffic
3. Network policies restrict pod-to-pod communication
4. Regular security updates are applied to base images

## Cost Optimization

1. Resource limits are set for all containers
2. Autoscaling is configured to scale down during low traffic
3. Spot instances can be used for non-critical workloads
4. Regular cleanup of unused resources

## Support

For support or questions, please contact the development team or create an issue in the repository. 