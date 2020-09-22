FROM nginx
LABEL author="xiejiarong"
COPY /dist/ /usr/share/nginx/html/
