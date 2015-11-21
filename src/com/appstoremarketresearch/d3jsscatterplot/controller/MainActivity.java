package com.appstoremarketresearch.d3jsscatterplot.controller;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;

import com.appstoremarketresearch.d3jsscatterplot.R;

/**
 * HomeActivity
 */
public class MainActivity extends Activity
{    
    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
}
