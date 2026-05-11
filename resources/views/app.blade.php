<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        <link href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800&display=swap" rel="stylesheet">

        <link rel="stylesheet" href="{{ asset('assets/template/css/open-iconic-bootstrap.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/template/css/animate.css') }}">
        
        <link rel="stylesheet" href="{{ asset('assets/template/css/owl.carousel.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/template/css/owl.theme.default.min.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/template/css/magnific-popup.css') }}">

        <link rel="stylesheet" href="{{ asset('assets/template/css/aos.css') }}">

        <link rel="stylesheet" href="{{ asset('assets/template/css/ionicons.min.css') }}">

        <link rel="stylesheet" href="{{ asset('assets/template/css/bootstrap-datepicker.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/template/css/jquery.timepicker.css') }}">

        
        <link rel="stylesheet" href="{{ asset('assets/template/css/flaticon.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/template/css/icomoon.css') }}">
        <link rel="stylesheet" href="{{ asset('assets/template/css/style.css') }}">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <script src="{{ asset('assets/template/js/jquery.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/jquery-migrate-3.0.1.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/popper.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/bootstrap.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/jquery.easing.1.3.js') }}"></script>
        <script src="{{ asset('assets/template/js/jquery.waypoints.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/jquery.stellar.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/owl.carousel.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/jquery.magnific-popup.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/aos.js') }}"></script>
        <script src="{{ asset('assets/template/js/jquery.animateNumber.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/bootstrap-datepicker.js') }}"></script>
        <script src="{{ asset('assets/template/js/jquery.timepicker.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/scrollax.min.js') }}"></script>
        <script src="{{ asset('assets/template/js/main.js') }}"></script>
    </body>
</html>
