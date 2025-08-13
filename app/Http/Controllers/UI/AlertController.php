<?php

namespace App\Http\Controllers\UI;
use App\Http\Controllers\Controller;

class AlertController extends Controller {
  public function index() { return view('alerts.index'); }
}