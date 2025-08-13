<?php

namespace App\Http\Controllers\UI;
use App\Http\Controllers\Controller;

class TideController extends Controller {
  public function index() { return view('tides.index'); }
}
