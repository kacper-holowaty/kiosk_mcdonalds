# Kiosk McDonalds - działający wraz z Kubernetes i Keycloakiem

### Projekt zaliczeniowy z przedmiotu: Technologie chmurowe oraz Bezpieczeństwo aplikacji webowych.

### Autor: **Kacper Hołowaty**

Wymaga zainstalowanego i uruchomionego Docker Desktop wraz z Kubernetes.

#### Pierwsze uruchomienie:

w pliku backend/kubernetes/backend.yaml zamiast obrazu: kacperholowaty/backend_maczek:latest, skorzystaj z obrazu kacperholowaty/backend_maczek_dane:latest w celu dodania początkowych produktów do menu. Po dodaniu można zmienić obraz na domyślny: kacperholowaty/backend_maczek:latest.

Należy również skonfigurować Keycloaka, tworząc realma o nazwie: mcdonalds-app, klienta: react-client oraz userów, gdzie minimum jednemu z nich należy przypisać wcześniej stworzoną rolę: admin.

Aby uruchomić aplikację, uruchom skrypt: **script.sh** (np. za pomocą polecenia: `./script.sh`). Aplikacja będzie działać na **http://localhost:32000**.

Jeśli chcesz zakończyć pracę z aplikacją wykonaj polecenia:

`kubectl delete deployment --all`
`kubectl delete services --all`

### Opis projektu:

Jest to rozszerzenie projektu z 3 semestru, czyli aplikacji do składania zamówień - kiosk McDonalds.
Projekt posiada łącznie 4 serwisy: Frontend - stworzony przy użyciu React.js, Backend - stworzony przy użyciu Express.js, bazę danych MongoDB oraz Keycloak.js. Aplikacja umożliwia użytkownikowi (bez logowania) jedynie składanie zamówień. Aplikacja posiada też panel administratora, gdzie po zalogowaniu jako użytkownik z przypisaną rolą **admin** można edytować produkty dostępne w kiosku. Do logowania używam Keycloaka.

#### Moja konfiguracja Keycloaka:

Stworzyłem realm o nazwie: **mcdonalds-app**. W tym realmie stworzyłem klienta: **react-client**, userów: **pracownik1**, **pracownik2** oraz **administrator**. Administratorowi przypisałem wcześniej stworzoną rolę: **admin**, dzięki czemu, w panelu administratora ma on możliwość edycji produktów w menu. Userzy pracownik1 i pracownik2, również mogą się zalogować do panelu administratora, jednak mają oni dostęp jedynie do statystyk sprzedaży. Możliwość edycji menu jest dla nich zablokowana.
