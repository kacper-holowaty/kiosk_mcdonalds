# Kiosk McDonalds - działający wraz z Kubernetes i Keycloakiem

### Projekt zaliczeniowy z przedmiotu: Technologie chmurowe oraz Bezpieczeństwo aplikacji webowych.

Wymaga zainstalowanego i uruchomionego Docker Desktop wraz z Kubernetes.

#### Pierwsze uruchomienie:

w pliku backend/kubernetes/backend.yaml zamiast obrazu: kacperholowaty/backend_maczek:latest, skorzystaj z obrazu kacperholowaty/backend_maczek_dane:latest w celu dodania początkowych produktów do menu. Po dodaniu można zmienić obraz na domyślny: kacperholowaty/backend_maczek:latest.

Należy również skonfigurować Keycloaka, tworząc realma o nazwie: mcdonalds-app, klienta: react-client oraz userów, gdzie minimum jednemu z nich należy przypisać wcześniej stworzoną rolę: admin.

Aby uruchomić aplikację, uruchom skrypt: **script.sh** (np. za pomocą polecenia: `./script.sh`). Aplikacja będzie działać na **http://localhost:32000**.

Jeśli chcesz zakończyć pracę z aplikacją wykonaj polecenia:

`kubectl delete deployment --all`
`kubectl delete services --all`
