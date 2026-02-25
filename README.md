Article Front – Application Angular

Frontend de l’application Article, développé en Angular, connecté à une API Spring Boot sécurisée via JWT.
L’application met l’accent sur la structuration modulaire, la gestion de l’authentification et l’intégration complète front-back.

Objectif du projet

Développer une interface web moderne permettant :

L’affichage dynamique des articles et catégories

L’authentification sécurisée via JWT

La gestion des rôles utilisateurs (USER / ADMIN)

L’administration des contenus

L’upload d’images

Une interface responsive inspirée d’une maquette Figma

Le projet démontre une intégration complète avec un backend sécurisé.

Stack technique

Angular 19

TypeScript

RxJS

Bootstrap

SCSS

Architecture

Architecture modulaire organisée par fonctionnalités :

Modules / composants dédiés

Services centralisés pour la communication HTTP

Guards pour la protection des routes

Interceptors pour l’injection automatique du JWT

Séparation claire des responsabilités

Principes appliqués :

Architecture par features

Gestion d’état via services

Sécurisation des routes selon rôles

Gestion propre des erreurs HTTP

Authentification

Stockage sécurisé du JWT

Interceptor HTTP pour ajout automatique du token

Guard Angular pour protéger les routes

Affichage conditionnel selon rôle utilisateur

Fonctionnalités principales
Authentification

Inscription

Connexion

Gestion de session JWT

Reset mot de passe

Articles

Liste des articles

Page détail

Création / modification / suppression (admin)

Upload d’images

Catégories

Liste des catégories

Filtrage des articles par catégorie

Interface

UI responsive

Design inspiré Figma

Composants réutilisables

Prérequis

Node.js

npm

Backend Spring Boot lancé en local
