<?php

namespace App\Http\Controllers\UI;
use App\Http\Controllers\Controller;

class DashboardController extends Controller {
  public function index() { return view('dashboard.index'); }
}
