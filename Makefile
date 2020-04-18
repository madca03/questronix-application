install-service:
	@mkdir -p /opt/questronix-application
	@cp -r * /opt/questronix-application
	@chmod +x ./scripts/*.sh
	@cp scripts/*.sh /usr/local/bin
	@cp scripts/*.service /etc/systemd/system
	@systemctl daemon-reload
	@systemctl enable questronix.inventory.app.service
	@systemctl start questronix.inventory.app.service
	systemctl status questronix.inventory.app.service