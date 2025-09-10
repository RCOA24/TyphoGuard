@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto p-6">
    <div class="mb-10 text-center">
        <h2 class="text-3xl font-bold text-slate-700 dark:text-slate-300">Dam Water Level Monitoring</h2>
        <div class="mt-4 flex justify-center items-center gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Safe
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <span class="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Warning
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>Critical
            </span>
        </div>
        <p class="text-sm text-slate-500 mt-4">
                Data from 
                <a href="https://www.pagasa.dost.gov.ph/flood#dam-information" target="_blank" 
                    class="text-blue-500 hover:text-blue-600 transition-colors">
                    PAGASA
                </a> 
                — <span class="font-medium text-slate-600 dark:text-slate-300">Real-time when available</span>, 
                otherwise updated daily at <span class="font-medium">8:00 AM</span>.
            </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        @foreach($dams as $dam)
            @php
                $rwl = floatval($dam['rwl']);
                $nhwl = floatval($dam['nhwl']);
                $percent = $nhwl > 0 ? min(($rwl / $nhwl) * 100, 100) : 0;

                if ($nhwl > 0 && $rwl >= $nhwl) {
                    $statusClass = 'status-danger';
                    $levelColor = '#ef4444';
                    $animationClass = 'pulse';
                } elseif ($percent > 80) {
                    $statusClass = 'status-warning';
                    $levelColor = '#f59e0b';
                    $animationClass = 'none';
                } else {
                    $statusClass = 'status-safe';
                    $levelColor = '#10b981';
                    $animationClass = 'none';
                }

                $slug = Str::slug($dam['dam']);
                $barGradient = "linear-gradient(90deg, {$levelColor}, {$levelColor})";
            @endphp

            <div class="dam-card group max-w-3xl mx-auto">
                <!-- Header with Dam Image -->
                    <div class="relative h-56 overflow-hidden rounded-t-xl">
                    @php
                        // Remove any existing "Dam" or "dam" from the name before adding it
                        $cleanName = trim(str_ireplace(['dam', 'Dam'], '', $dam['dam']));
                        $imageName = strtolower(str_replace(' ', '', $cleanName)) . '-dam.jpg';
                    @endphp
                    <img src="{{ asset('images/dams/' . $imageName) }}" 
                         alt="{{ $cleanName }} Dam" 
                         class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-6">
                        <h3 class="text-2xl font-bold text-white">{{ $dam['dam'] }}</h3>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="px-3 py-1 rounded-full text-xs font-medium {{ 
                                $percent >= 100 ? 'bg-red-600 text-white' : 
                                ($percent > 80 ? 'bg-amber-500 text-white' : 
                                'bg-emerald-500 text-white') 
                            }}">
                                {{ $percent >= 100 ? 'Critical Level' : ($percent > 80 ? 'Warning Level' : 'Safe Level') }}
                            </span>
                            <span class="text-white/90 text-sm">
                                Updated: {{ $dam['observation_time'] }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Simple Status Message -->
                <div class="px-6 py-3">
                    <div class="rounded-lg p-4 {{ 
                        $percent >= 100 ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' : 
                        ($percent > 80 ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800' : 
                        'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800') 
                    }}">
                        <div class="flex items-start gap-3">
                            <!-- Status Icon -->
                            <div class="mt-1">
                                @if($percent >= 100)
                                    <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                    </svg>
                                @elseif($percent > 80)
                                    <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                    </svg>
                                @else
                                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                @endif
                            </div>
                            <!-- Status Message -->
                            <div>
                                <h4 class="font-medium {{ 
                                    $percent >= 100 ? 'text-red-800 dark:text-red-200' : 
                                    ($percent > 80 ? 'text-amber-800 dark:text-amber-200' : 
                                    'text-green-800 dark:text-green-200') 
                                }}">
                                    @if($percent >= 100)
                                        Critical Water Level - Immediate Action Required
                                    @elseif($percent > 80)
                                        High Water Level - Stay Alert
                                    @else
                                        Safe Water Level - Normal Operations
                                    @endif
                                </h4>
                                <p class="mt-1 text-sm {{ 
                                    $percent >= 100 ? 'text-red-600 dark:text-red-300' : 
                                    ($percent > 80 ? 'text-amber-600 dark:text-amber-300' : 
                                    'text-green-600 dark:text-green-300') 
                                }}">
                                    @if($percent >= 100)
                                        The water level is above the safe limit. Please follow local authorities' instructions.
                                    @elseif($percent > 80)
                                        The water level is getting high. Stay informed about any updates.
                                    @else
                                        The water level is within safe limits. No action needed.
                                    @endif
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Water Level Information -->
                <div class="p-6 grid grid-cols-2 gap-4">
                    <!-- Current Water Level -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <div class="text-sm text-slate-500 dark:text-slate-400">Current Water Level</div>
                        </div>
                        <div class="mt-2">
                            <div class="text-3xl font-bold {{ $statusClass }}">{{ $dam['rwl'] }}m</div>
                            <div class="text-sm {{ $rwl > $dam['nhwl'] ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-slate-500' }}">
                                @if($rwl > $dam['nhwl'])
                                    {{ number_format($rwl - $dam['nhwl'], 2) }}m above safe level
                                @else
                                    {{ number_format($dam['nhwl'] - $rwl, 2) }}m below safe level
                                @endif
                            </div>
                        </div>
                    </div>
                    
                    <!-- Safe Level Indicator -->
                    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div class="text-sm text-slate-500 dark:text-slate-400">Safe Water Level</div>
                        </div>
                        <div class="mt-2">
                            <div class="text-3xl font-bold text-slate-700 dark:text-slate-200">{{ $dam['nhwl'] }}m</div>
                            <div class="text-sm text-slate-400 dark:text-slate-500">Maximum safe capacity</div>
                        </div>
                    </div>
                </div>

                <!-- Water Level Visualization -->
                <div class="px-6">
                    <div class="dam-water-visual relative h-32 bg-slate-100 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                        @php
                            $rwl = floatval($dam['rwl']); // Current water level
                            $nhwl = floatval($dam['nhwl']); // Normal high water level
                            $percent = floatval($dam['percent']); // Get the percentage from controller
                            
                            // Always show the actual percentage even if it's low
                            $visualPercent = $percent;
                            
                            // Calculate actual water level text
                            // Use the scraped data regardless of nhwl value
                            if ($rwl >= $nhwl) {
                                $levelText = number_format($rwl - $nhwl, 2) . 'm above normal';
                            } else {
                                $levelText = number_format($nhwl - $rwl, 2) . 'm below normal';
                            }
                        @endphp
                        
                        <div class="absolute inset-x-0 bottom-0 transition-all duration-500 {{ 
                            $visualPercent >= 100 ? 'bg-gradient-to-t from-red-500 to-red-400' : 
                            ($visualPercent > 80 ? 'bg-gradient-to-t from-amber-500 to-amber-400' : 
                            'bg-gradient-to-t from-emerald-500 to-emerald-400')
                        }}" style="height: {{ max(20, $visualPercent) }}%;">
                            <div class="h-full relative">
                                <!-- Wave effect -->
                                <div class="absolute inset-0 opacity-20">
                                    <div class="wave"></div>
                                    <div class="wave" style="animation-delay: 1s;"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Water Level Information -->
                        <div class="absolute top-2 left-2 flex flex-col gap-1">
                            <div class="px-2 py-1 text-sm text-white bg-slate-800/75 rounded">
                                {{ number_format($visualPercent, 0) }}% Full
                            </div>
                            <div class="px-2 py-1 text-xs text-white bg-slate-800/75 rounded">
                                {{ $levelText }}
                            </div>
                        </div>

                        <!-- Level lines -->
                        <div class="absolute inset-y-0 right-0 w-16 flex flex-col justify-between p-2">
                            <div class="flex items-center gap-1">
                                <div class="h-px w-2 bg-slate-300"></div>
                                <div class="text-xs text-slate-500">{{ $nhwl }}m</div>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="h-px w-2 bg-slate-300"></div>
                                <div class="text-xs text-slate-500">{{ number_format($nhwl * 0.75, 1) }}m</div>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="h-px w-2 bg-slate-300"></div>
                                <div class="text-xs text-slate-500">{{ number_format($nhwl * 0.5, 1) }}m</div>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="h-px w-2 bg-slate-300"></div>
                                <div class="text-xs text-slate-500">{{ number_format($nhwl * 0.25, 1) }}m</div>
                            </div>
                            <div class="flex items-center gap-1">
                                <div class="h-px w-2 bg-slate-300"></div>
                                <div class="text-xs text-slate-500">0m</div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                    .wave {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23FFF'/%3E%3C/svg%3E");
                        background-position: 0 bottom;
                        transform: translate3d(0, 0, 0);
                        background-repeat: repeat-x;
                        animation: wave 15s linear infinite;
                    }

                    @keyframes wave {
                        0% { background-position-x: 0; }
                        100% { background-position-x: 800px; }
                    }
                </style>

                <!-- Detailed Water Status -->
                <div class="mt-4 px-6">
                    <div class="space-y-4">
                        <!-- Water Level Trend -->
                        <div class="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                            <h4 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">Water Level Trend</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    @php
                                        $change = floatval($dam['change_24h'] ?? '0');
                                        $changeIcon = $change > 0 ? '↑' : ($change < 0 ? '↓' : '→');
                                        $changeClass = $change > 0 ? 'text-red-500' : ($change < 0 ? 'text-green-500' : 'text-slate-500');
                                        $changeDescription = $change > 0 ? 'Rising' : ($change < 0 ? 'Falling' : 'Stable');
                                    @endphp
                                    <div class="flex items-center gap-2">
                                        <span class="{{ $changeClass }} text-2xl font-bold">{{ $changeIcon }}</span>
                                        <div>
                                            <div class="text-sm text-slate-500 dark:text-slate-400">Last 24 Hours</div>
                                            <div class="font-medium {{ $changeClass }}">{{ $changeDescription }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-sm text-slate-500 dark:text-slate-400">Change Amount</div>
                                    <div class="font-medium {{ $changeClass }}">
                                        @if($change > 0)
                                            Increased by {{ number_format(abs($change), 2) }}m
                                        @elseif($change < 0)
                                            Decreased by {{ number_format(abs($change), 2) }}m
                                        @else
                                            No change
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Dam Operation Status -->
                        <div class="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                            <h4 class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">Dam Operations</h4>
                            <div class="space-y-3">
                                <div>
                                    <div class="text-sm text-slate-500 dark:text-slate-400">Current Operation Plan</div>
                                    <div class="font-medium text-slate-700 dark:text-slate-300">
                                        {{ $dam['rule_curve'] }}
                                    </div>
                                    @if($dam['dev_rule_curve'])
                                        <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Adjustment from plan: {{ $dam['dev_rule_curve'] }}
                                        </div>
                                    @endif
                                </div>
                                
                                <div class="flex items-center gap-2 mt-2">
                                    @if($rwl >= $dam['nhwl'])
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                            Requires Action
                                        </span>
                                    @elseif($percent > 80)
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                                            Monitor Closely
                                        </span>
                                    @else
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                                            Normal Operations
                                        </span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Operational Data -->
                <div class="px-6 pb-6">
                    <div class="relative overflow-hidden">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <!-- Gate Operations -->
                            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <h4 class="font-medium text-slate-700 dark:text-slate-300">Gate Operations</h4>
                                </div>
                                <div class="p-4 space-y-2 text-sm">
                                    <div class="grid grid-cols-3 gap-2">
                                        <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                                            <div class="text-slate-500 dark:text-slate-400">Hours</div>
                                            <div class="font-medium">{{ $dam['gate_opening']['hr'] }}</div>
                                        </div>
                                        <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                                            <div class="text-slate-500 dark:text-slate-400">Gates</div>
                                            <div class="font-medium">{{ $dam['gate_opening']['gates'] }}</div>
                                        </div>
                                        <div class="bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                                            <div class="text-slate-500 dark:text-slate-400">Meters</div>
                                            <div class="font-medium">{{ $dam['gate_opening']['meters'] }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Water Movement -->
                            <div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <h4 class="font-medium text-slate-700 dark:text-slate-300">Water Movement</h4>
                                </div>
                                <div class="p-6">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <!-- Water Coming In -->
                                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                                </svg>
                                                <span class="text-sm text-blue-700 dark:text-blue-300">Water Coming In</span>
                                            </div>
                                            <div class="mt-1">
                                                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                    {{ $dam['inflow'] }} m³/s
                                                </div>
                                                <div class="text-xs text-blue-600/75 dark:text-blue-400/75">
                                                    Cubic meters per second
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Water Going Out -->
                                        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                                </svg>
                                                <span class="text-sm text-blue-700 dark:text-blue-300">Water Going Out</span>
                                            </div>
                                            <div class="mt-1">
                                                <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                    {{ $dam['outflow'] }} m³/s
                                                </div>
                                                <div class="text-xs text-blue-600/75 dark:text-blue-400/75">
                                                    Cubic meters per second
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Water Balance Explanation -->
                                    <div class="mt-4 text-sm">
                                        <div class="text-slate-600 dark:text-slate-400">
                                            @php
                                                $inflow = floatval($dam['inflow']);
                                                $outflow = floatval($dam['outflow']);
                                                $balance = $inflow - $outflow;
                                                $balanceText = $balance > 0 ? 'rising' : ($balance < 0 ? 'falling' : 'stable');
                                                $balanceClass = $balance > 0 ? 'text-red-600 dark:text-red-400' : ($balance < 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400');
                                            @endphp
                                            <p>Based on current flow rates, the water level is <span class="{{ $balanceClass }} font-medium">{{ $balanceText }}</span>.</p>
                                            @if($balance > 0)
                                                <p class="mt-1 text-xs text-slate-500">More water is coming in than going out.</p>
                                            @elseif($balance < 0)
                                                <p class="mt-1 text-xs text-slate-500">More water is going out than coming in.</p>
                                            @else
                                                <p class="mt-1 text-xs text-slate-500">The amount of water coming in matches the amount going out.</p>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div><!-- End of dam-card -->
        @endforeach
    </div>
</div>
@endsection
