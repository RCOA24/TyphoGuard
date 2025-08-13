<?php

namespace App\Http\Controllers\UI;
use App\Http\Controllers\Controller;

class DamController extends Controller {
  public function index() { return view('dams.index'); }
}
