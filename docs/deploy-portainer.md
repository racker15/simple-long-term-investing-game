# Deploy with Portainer (Docker Standalone)

The repository already has a multi-stage Dockerfile that builds the static Vite app and serves it with Nginx. No database, runtime secrets or server-side persistent volume are required. Game progress lives in each browser's local storage.

1. In **Portainer > Stacks > Add stack**, select **Git repository** and use this repository's Git URL, branch, and authentication (if applicable).
2. Set **Compose path** to `compose.portainer.yml` (at the repository root).
3. Optionally set the stack environment variable `INVESTING_GAME_PORT` (default: `8080`). It must not conflict with an existing published port.
4. Deploy the stack and open `http://<docker-host>:8080` (or the configured port). Put a TLS reverse proxy in front before publicly exposing the application.
5. To update, pull the latest Git revision and redeploy the stack. The Compose file uses `pull_policy: build` to request a fresh local image build on each Compose deployment.

This configuration is intended for a **Docker Standalone endpoint where Portainer can build images from the checked-out Git source**. Portainer's Git-stack build support can vary by Portainer version and endpoint type; notably, builds may not be supported on remote Docker environments or Swarm. If Portainer reports that building is unsupported, build/publish the image via CI or on the Docker host and replace `build` and `pull_policy: build` with the published image reference.

The container exposes port 80 internally. Change only the left side of the port mapping to move the externally accessible port. No volume is needed. Browser-local progress is not synchronized between devices and will be lost if browser storage is cleared.
