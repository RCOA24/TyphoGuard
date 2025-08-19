<?php

namespace App\Http\Controllers\UI;

use App\Http\Controllers\Controller;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\DomCrawler\Crawler;
use Illuminate\Support\Facades\Cache;

class DamController extends Controller
{
    public function index()
    {
        // Cache key
        $cacheKey = 'dams_data';

        // Try to get from cache first
        $dams = Cache::remember($cacheKey, 300, function () {
            $httpClient = HttpClient::create();
            $url = 'https://www.pagasa.dost.gov.ph/flood';

            $response = $httpClient->request('GET', $url);
            $html = $response->getContent();

            $crawler = new Crawler($html);

            $dams = $crawler->filter('.table tbody tr')->each(function (Crawler $node) {
                $cols = $node->filter('td');

                if ($cols->count() < 10) return null;

                $rwlText = trim(str_replace(['m', ','], '', $cols->eq(2)->text('N/A')));
                $nhwlText = trim(str_replace(['m', ','], '', $cols->eq(4)->text('N/A')));

                if (!is_numeric($rwlText) || !is_numeric($nhwlText)) return null;

                $gateHr = trim($cols->eq(8)->text(''));
                $gateGates = trim($cols->eq(9)->text(''));
                $gateMeters = trim($cols->eq(10)->text(''));
                $inflow = trim($cols->eq(11)->text(''));
                $outflow = trim($cols->eq(12)->text(''));

                if (empty($gateHr) && empty($gateGates) && empty($gateMeters) && empty($inflow) && empty($outflow)) return null;

                $rwl = floatval($rwlText);
                $nhwl = floatval($nhwlText);
                $percent = $nhwl > 0 ? min(($rwl / $nhwl) * 100, 100) : 0;

                return [
                    'dam' => trim($cols->eq(0)->text('N/A')),
                    'observation_time' => trim($cols->eq(1)->text('N/A')),
                    'rwl' => $rwl,
                    'nhwl' => $nhwl,
                    'percent' => $percent,
                    'dev_nhwl' => trim($cols->eq(5)->text('N/A')),
                    'rule_curve' => trim($cols->eq(6)->text('N/A')),
                    'dev_rule_curve' => trim($cols->eq(7)->text('N/A')),
                    'gate_opening' => [
                        'hr' => $gateHr,
                        'gates' => $gateGates,
                        'meters' => $gateMeters,
                    ],
                    'inflow' => $inflow,
                    'outflow' => $outflow,
                ];
            });

            return array_filter($dams);
        });

        // Sort by water level percentage descending
        usort($dams, fn($a, $b) => $b['percent'] <=> $a['percent']);

        return view('dams.index', compact('dams'));
    }
}
