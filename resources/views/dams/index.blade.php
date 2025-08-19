@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto p-6">
    
    <h2 class="text-3xl font-bold mb-10 text-center text-slate-400">Dam Water Level Dashboard  <p class="text-xs text-slate-500 mt-2">Dam Water Level data by <a href="https://www.pagasa.dost.gov.ph/flood#dam-information" target="_blank" class="text-blue-500"> PAGASA</a></h2>
    

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        @foreach($dams as $dam)
            @php
                $rwl = floatval($dam['rwl']);
                $nhwl = floatval($dam['nhwl']);
                $percent = $nhwl > 0 ? min(($rwl / $nhwl) * 100, 100) : 0;

                if ($nhwl > 0 && $rwl >= $nhwl) {
                    $statusClass = 'dam-badge-danger';
                    $barGradient = 'linear-gradient(270deg, #bb2929ff, #e1bcbcff, #bb2929ff)';
                    $animationClass = 'animate-pulse-glow';
                } elseif ($percent > 80) {
                    $statusClass = 'dam-badge-warn';
                    $barGradient = 'linear-gradient(to right, #fbbf24, #f59e0b)';
                    $animationClass = 'animate-flow';
                } else {
                    $statusClass = 'dam-badge-ok';
                    $barGradient = 'linear-gradient(to right, #34d399, #10b981)';
                    $animationClass = 'animate-flow';
                }

                $slug = Str::slug($dam['dam']);
            @endphp

            <div class="dam-card hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <!-- Header -->
                <div class="dam-card-header bg-gradient-to-r from-slate-700 to-gray-800 text-white text-lg px-5 py-4 shadow-inner text-center">
                    {{ $dam['dam'] }}
                </div>

                <!-- Body -->
                <div class="dam-card-body p-5 flex flex-col gap-5">
                    <!-- KPI -->
                    <div class="text-center">
                        <div id="{{ $slug }}-level" class="dam-kpi text-5xl text-gray-800 dark:text-white">{{ $dam['rwl'] }} m</div>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Normal High Water Level: <span id="{{ $slug }}-normal">{{ $dam['nhwl'] }}</span> m
                        </p>
                        <div class="mt-3">
                            <span class="{{ $statusClass }} text-sm {{ $percent >= 100 ? 'badge-glow' : '' }}">
                                {{ $percent >= 100 ? 'Above NHWL' : 'Normal' }}
                            </span>
                        </div>
                    </div>

                    <!-- Water Level Bar -->
                    <div class="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-sm">
                        <div class="absolute h-6 rounded-full transition-all duration-700 ease-in-out {{ $animationClass }}"
                             style="width: {{ $percent }}%; background: {{ $barGradient }};
                                    background-size: 600% 100%;">
                        </div>
                        <!-- Optional NHWL marker -->
                        <div class="absolute top-0 bottom-0 w-0.5 bg-red-500" 
                             style="left: {{ $nhwl > 0 ? 100 : 0 }}%;"></div>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {{ number_format($percent, 1) }}% of NHWL
                    </div>

                    <!-- Details Section -->
                    <div class="bg-blue-50 dark:bg-slate-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex flex-col gap-2 shadow-inner">
                        <div><strong>Observation:</strong> {{ $dam['observation_time'] }}</div>
                        <div><strong>Rule Curve:</strong> {{ $dam['rule_curve'] }} (Dev: {{ $dam['dev_rule_curve'] }})</div>
                        <div><strong>Gate Opening:</strong> Hr: {{ $dam['gate_opening']['hr'] }}, Gates: {{ $dam['gate_opening']['gates'] }}, Meters: {{ $dam['gate_opening']['meters'] }}</div>
                        <div><strong>Inflow / Outflow:</strong> {{ $dam['inflow'] }} / {{ $dam['outflow'] }}</div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>


@endsection
