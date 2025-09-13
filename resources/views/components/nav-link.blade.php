{{-- resources/views/components/nav-link.blade.php --}}
@props(['href' => '#', 'label' => '', 'icon' => null, 'tooltip' => false])
@php
$active = request()->is(ltrim(parse_url($href, PHP_URL_PATH), '/').'*');
@endphp

@if($tooltip)
  {{-- Version with tooltip for collapsible sidebar --}}
  <div class="nav-item relative">
    <a href="{{ $href }}"
       class="nav-link-content flex items-center gap-2 px-3 py-2 rounded-md text-sm {{ $active ? 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800' }}">
      @if($icon === 'activity')
        <x-icon.activity class="w-5 h-5 flex-shrink-0"/>
      @elseif($icon === 'droplet')
        <x-icon.droplet class="w-5 h-5 flex-shrink-0"/>
      @elseif($icon === 'waves')
        <x-icon.waves class="w-5 h-5 flex-shrink-0"/>
      @elseif($icon === 'bell')
        <x-icon.bell class="w-5 h-5 flex-shrink-0"/>
      @endif
      <span class="nav-label label-transition">{{ $label }}</span>
    </a>
    <div class="sidebar-tooltip">{{ $label }}</div>
  </div>
@else
  {{-- Standard version for mobile sidebar --}}
  <a href="{{ $href }}"
     class="flex items-center gap-2 px-3 py-2 rounded-md text-sm {{ $active ? 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800' }}">
    @if($icon === 'activity')
      <x-icon.activity class="w-5 h-5 flex-shrink-0"/>
    @elseif($icon === 'droplet')
      <x-icon.droplet class="w-5 h-5 flex-shrink-0"/>
    @elseif($icon === 'waves')
      <x-icon.waves class="w-5 h-5 flex-shrink-0"/>
    @elseif($icon === 'bell')
      <x-icon.bell class="w-5 h-5 flex-shrink-0"/>
    @endif
    <span>{{ $label }}</span>
  </a>
@endif