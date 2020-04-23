install-service:
	@mkdir -p /var/log/questronix
	@cp -r * /opt/questronix-application
	@chmod +x ./scripts/*.sh
	@cp scripts/*.sh /usr/local/bin
	@cp scripts/*.service /etc/systemd/system
	@systemctl daemon-reload
	@systemctl enable questronix.inventory.app.service
	@systemctl start questronix.inventory.app.service
	@echo "Displaying status of service in 10 secs..."
	@sleep 10
	systemctl status questronix.inventory.app.service
