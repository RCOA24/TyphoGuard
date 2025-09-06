<?php

namespace App\Http\Controllers\UI;
use App\Http\Controllers\Controller;

class AboutController extends Controller {
  public function index() { return view('about.index'); }
}