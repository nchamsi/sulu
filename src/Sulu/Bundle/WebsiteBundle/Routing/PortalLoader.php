<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\WebsiteBundle\Routing;

use Sulu\Component\Webspace\Analyzer\RequestAnalyzerInterface;
use Symfony\Component\Config\Loader\Loader;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

/**
 * This route loader is responsible for loading routes from a routing file, and adjust the routes in a way, so that
 * there will be an own route for every portal registered.
 */
class PortalLoader extends Loader
{
    /**
     * {@inheritdoc}
     */
    public function load($resource, $type = null)
    {
        $collection = new RouteCollection();

        /** @var Route[] $importedRoutes */
        $importedRoutes = $this->import($resource, null);

        $condition = sprintf(
            'request.get("_sulu").getAttribute("portalInformation") !== null ' .
            '&& request.get("_sulu").getAttribute("portalInformation").getType() === %s',
            RequestAnalyzerInterface::MATCH_TYPE_FULL
        );

        foreach ($importedRoutes as $importedRouteName => $importedRoute) {
            $importedCondition = $importedRoute->getCondition();

            $collection->add(
                $importedRouteName,
                new Route(
                    '{prefix}' . ltrim($importedRoute->getPath(), '/'),
                    $importedRoute->getDefaults(),
                    array_merge(['prefix' => '(.*/)?'], $importedRoute->getRequirements()),
                    $importedRoute->getOptions(),
                    $importedRoute->getHost(),
                    $importedRoute->getSchemes(),
                    $importedRoute->getMethods(),
                    $condition . (!empty($importedCondition) ? ' and (' . $importedCondition . ')' : '')
                )
            );
        }

        return $collection;
    }

    /**
     * {@inheritdoc}
     */
    public function supports($resource, $type = null)
    {
        return 'portal' === $type;
    }
}
