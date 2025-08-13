@props(['href','#','label'=>'','icon'=>null])
@php
$active = request()->is(ltrim(parse_url($href, PHP_URL_PATH), '/').'*');
@endphp
<a href="{{ $href }}"
   class="flex items-center gap-2 px-3 py-2 rounded-md text-sm {{ $active ? 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800' }}">
  @if($icon === 'activity')
    <x-icon.activity/>
  @elseif($icon === 'droplet')
    <x-icon.droplet/>
  @elseif($icon === 'waves')
    <x-icon.waves/>
  @elseif($icon === 'bell')
    <x-icon.bell/>
  @endif
  <span>{{ $label }}</span>
</a>
