

@extends('layouts.app')
@section('content')
<div class="space-y-6">
  <div class="card">
    <div class="card-head">Dams (Prototype)</div>
    <div class="card-body">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach([
          ['name'=>'Angat','level'=>209.3,'nhwl'=>210,'status'=>'warn'],
          ['name'=>'Magat','level'=>186.1,'nhwl'=>190,'status'=>'ok'],
          ['name'=>'San Roque','level'=>277.9,'nhwl'=>280,'status'=>'ok'],
        ] as $d)
        <div class="card">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div class="font-semibold">{{ $d['name'] }}</div>
              <span class="{{ $d['status']=='ok'?'badge-ok':($d['status']=='warn'?'badge-warn':'badge-danger') }}">
                {{ ucfirst($d['status']) }}
              </span>
            </div>
            <div class="mt-2 text-sm text-slate-500">Level</div>
            <div class="kpi">{{ number_format($d['level'],1) }} m</div>
            <p class="text-xs text-slate-500">NHWL {{ $d['nhwl'] }} m</p>
          </div>
        </div>
        @endforeach
      </div>
    </div>
  </div>
</div>
@endsection
