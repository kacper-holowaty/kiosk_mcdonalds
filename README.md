# Aplikacja do składania zamówień - kiosk McDonald's

### Autor: **Kacper Hołowaty**

> ⚠️**Ważne:** Wymaga zainstalowanego i uruchomionego Docker Desktop wraz z Kubernetes.

#### Pierwsze uruchomienie:

w pliku `backend/kubernetes/backend.yaml` (w 17 linijce) zamiast obrazu: **kacperholowaty/backend-maczek:latest**, skorzystaj z obrazu: **kacperholowaty/backend-maczek-dane:latest** w celu dodania początkowych produktów do menu. Po dodaniu można zmienić obraz na domyślny: **kacperholowaty/backend-maczek:latest**. 

## Uruchomienie aplikacji

Aby uruchomić aplikację, uruchom skrypt: **script.sh** (np. za pomocą polecenia: `./script.sh`). Aplikacja będzie działać na **http://localhost:32000**.

Jeśli chcesz zakończyć pracę z aplikacją wykonaj polecenia:

`kubectl delete deployment --all`

`kubectl delete services --all`

### Opis projektu:

#### 🚀 Użyte technologie

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Keycloak](https://img.shields.io/badge/Keycloak-0072C6?style=for-the-badge&logo=keycloak&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

#### 📝 Opis

Aplikacja umożliwia użytkownikowi (bez konieczności logowania) składanie zamówień w restauracji McDonald's. Proces zamówienia rozpoczyna się od wyboru rodzaju realizacji zamówienia ('Na miejscu' lub 'Na wynos'), a następnie użytkownik może wybierać produkty z dostępnego menu, podzielonego na różne kategorie (np. napoje, burgery itp.). Istnieje możliwość dostosowania liczby zamawianych produktów. Użytkownik, po wyborze tego co chce zamówić, przechodzi do koszyka, gdzie otrzymuje podsumowanie zamówienia. Potem przechodzi do panelu płatności, a na końcu otrzymuje numer zamówienia.
Aplikacja posiada też panel administratora, gdzie po zalogowaniu dostępne są statystyki sprzedaży, a dodatkowo po zalogowaniu jako użytkownik z przypisaną rolą **admin**, można edytować produkty dostępne w menu restauracji. 

#### 🔐 Konfiguracja Keyclaok

Stworzono realm o nazwie: **mcdonalds-app**, klienta: **react-client** oraz użytkowników: **pracownik1**, **pracownik2** oraz **administrator**, gdzie jednemu z nich (*administrator*) przypisano wcześniej stworzoną rolę realma: **admin**, dzięki czemu, w panelu administratora, ma on możliwość edycji produktów dostępnych w menu restauracji. Użytkownicy *pracownik1* i *pracownik2*, również mogą zalogować się do panelu administratora, jednak mają oni dostęp jedynie do statystyk sprzedaży - możliwość edycji menu jest dla nich zablokowana. Każdy z użytkowników ma ustawione hasło, które jest wymagane przy logowaniu. Konfiguracja dostępna jest w pliku `kubernetes/keycloak/realm-export.json` i jest automatycznie aplikowana przy uruchamianiu kontenera Keycloak za pomocą Kubernetes.

#### 📸 Wygląd aplikacji

**Ekran startowy**
![Ekran startowy](imagens/start_screen.png)

**Menu**
![Menu](imagens/main_menu.png)

**Koszyk**
![Koszyk](imagens/basket.png)

**Panel administratora - formularz edycji produktu**
![Formularz edycji produktu](imagens/admin_panel_edit_product.png)
