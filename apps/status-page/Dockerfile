FROM nginx:stable-alpine

COPY nginx/ /etc/nginx/
COPY ./dist /usr/share/nginx/html

ENTRYPOINT [ "/bin/sh", "/etc/nginx/entrypoint.sh" ]
