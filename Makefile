YML	= docker-compose.yml

all:
	docker-compose -f $(YML) up --build -d

logBackend:
	docker-compose logs -f backend

logFrontend:
	docker-compose logs -f frontend

down:
	docker-compose -f $(YML) down

re: fclean all

clean:
	docker-compose -f $(YML) rm $(docker ps -a)

fclean:	clean
	docker-compose -f $(YML) down --rmi all -v

.PHONY: all re down clean fclean
