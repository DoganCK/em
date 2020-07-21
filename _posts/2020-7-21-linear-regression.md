---
layout: post
title:  "Linear Regression"
categories: mathematics statistics

---

## Objective
Fitting a line to data

<script src="https://d3js.org/d3.v5.js"></script>
<script src="https://unpkg.com/mathjs@7.0.2/dist/math.min.js"></script>
<div id="linregress"></div>
<script src="{{ base.url | prepend: site.url }}/assets/js/scatter_linregress.js"></script>
Go ahead and try to fit a line!
## Setup
### Measuring **fit**
Everyone probably has a pretty good understanding idea when it comes to fit. We can easily judge that the line in the right-hand-side graph is a much better fit to the data than its left-hand-side counterpart.  
[Images here, one with good, the other with bad fit]  
However as the fit becomes better and better, we end up needing a more rigorous understanding.

#### Error
What we want to measure when we measure how well a line fits our data is to measure the error. And we want to reduce error as much as possible. What is error? How far off our line is from the actual values (scattered points in our examples above).

That is, for a singe point $y - \hat{y}$. [This needs to talk to the graph on top of the page]

Great, we have calculated the error for a single point; it's just how far off it fall from actuality.

#### Squared Error
Our ultimate goal is to extend the error that we calculate from all of the single points to the whole line that we're generating. There might be a couple of ways of doing this. However, observe one thing first: If we sum all the errors together, positive errors would cancel out negative errors. An error is an error regardless of its sign. One error shouldn't cancel another!

We could do a couple of things here, one of which, following the tradition, is squaring the errors. Voila! We've gotten rid of the negative signs.

$(y-\hat{y})^2$

#### Sum of Squared Error (SSE)
Now we can sum all the squared errors without worrying about errors cancelling each other out.

Let:  
$Y$: The vector of actual values  
$\hat{Y}$: The vector of our guesses (predictions, or whatever)

So we have:  
$$\newcommand\SSE{\mathit{SSE}}$$
$\SSE = \sum_{i=1}^{n}{(Y_i - \hat{Y}_i)^2}$  


This is already a pretty good measure of how good the fit is; much better than what we started with.  
It's worth tweaking a little bit more, though.

#### Root Mean Squared Error
Since we squared all the errors in the last step and took their sum, we've blown things out of proportion a little bit. Moreover, the unit of error is also the square of the unit of the original measurement of the dependent variable, so there's a mismatch there. We can fix these things by calculating the mean error and taking the sqaure root of it.

$\newcommand\RMSE{\mathit{RMSE}}$
$\RMSE = \sqrt{\frac{\SSE}{n}}$

Okay, so in this setup section we've come up with a rigorous way of evaluating fitness of a line, given some data. Next, we're going to try to identify that line.

## Finding the Best Fit

There are two fundamentally different ways of findding the line that fits our expectations--as outlined above. One is applying brute force. That is, we can approximate that line by trying thousands, even millions of alternatives and calculating the error for each. But, we're going to do that a lot in this series. So for once let's go with the other, much more elegant, alternative.

### Precisifying the Problem
What do we want? We want a line that fits the data (Y) best.  
What line is that? The one with the least error.  
Error? Since we're not changing the data let's compare the $\SSE$ of each alternative to others.  
So we want the line with the least $\SSE$? Yep!

### A small amount of calculus to the rescue
We want the line with the least sum of squared errors. In order to do that, we need to find out when the derivative of the SSE formula equals 0.

What was the formula for $\SSE$, again?  
$\SSE = \sum_{i=1}^{n}{(Y_i - \hat{Y}_i)^2}$  
It turns out this is actually a pretty general formula for finding the SSE not just of linear models but all sorts of models. Since we're fitting a linear model, we can be a little bit more specific than this to go ahead with our calculations.  
In particular, we know that for any $\hat{Y}_i$,  
$\hat{Y}_i = sX_i + b$

After the corresponding substituion, we get:  
$\SSE = \sum_{i=1}^{n}{(Y_i - sX_i - b)^2}$

Now, we are going to find out the slope (s) and the bias (b) when $\SSE=0$. We're going to do that separately by taking partial derivatives of $\SSE$ with respect to each.

#### Calculating b
Let's rewrite our formula and equate its derivative to 0.  
$$0 = \frac{\partial \SSE}{\partial b}\left(\sum_{i=1}^{n}{(Y_i - sX_i - b)^2}\right).$$

Using the chain rule, we get:  
$$0 = \sum_{i=1}^{n}{-2(Y_i - sX_i - b)}.$$

Pulling the '$-2$' out, and dividing each side by it:  
$$0 = \sum_{i=1}^{n}{(Y_i - sX_i - b)},$$

which evaluates to:
$$0 = \sum_{i=1}^{n}Y_i - \sum_{i=1}^{n}sX_i - \sum_{i=1}^{n}b.$$

Since '$b$' and '$s$' are independent of $i$:
$$ \sum_{i=1}^{n}b = nb, \sum_{i=1}^{n}sX_i = s\sum_{i=1}^{n}X_i$$

Therefore:
$$b = \frac{\sum_{i=1}^{n}Y_i - s\sum_{i=1}^{n}X_i}{n}$$

Look at it more closely:
$$b = \frac{\sum_{i=1}^{n}Y_i}{n} - s\frac{\sum_{i=1}^{n}X_i}{n}$$
And see the means in disguise:
$$b = \bar{Y} - s\bar{X}$$

Cool! But we still need to know the slope.

#### Calculating s
Let's start just like before, but with $s$ instead of $b$.
$$0 = \frac{\partial \SSE}{\partial s}\left(\sum_{i=1}^{n}{(Y_i - sX_i - b)^2}\right)$$

Using the chain rule, we get:
$$0 = \sum_{i=1}^{n}{-2X_i(Y_i - sX_i - b)}$$
$$0 = \sum_{i=1}^{n}{X_i(Y_i - sX_i - b)}$$
Distributing $X_i$:
$$0 = \sum_{i=1}^{n}{(Y_iX_i - sX_i^2 - bX_i)}$$
Substituting $b$ for what we found above:
$$0 = \sum_{i=1}^{n}{(Y_iX_i - sX_i^2 - (\bar{Y} - s\bar{X})X_i)}$$

$$0 = \sum_{i=1}^{n}{(Y_iX_i - sX_i^2 - \bar{Y}X_i + s\bar{X}X_i)}$$

$$0 = \sum_{i=1}^{n}{(X_iY_i - X_i\bar{Y}) - s\sum_{i=1}^{n}(X_i^2 - \bar{X}X_i)}$$

Finally:
$$s = \frac{\sum_{i=1}^{n}(X_iY_i - X_i\bar{Y})}{\sum_{i=1}^{n}(X_i^2 - \bar{X}X_i)}$$

## Pythonification

```python
from matplotlib import pyplot as plt
import numpy as np

def linear_regression(X,Y):
    Y_bar, X_bar = Y.mean(), X.mean()
    s = ((np.dot(X,Y) - np.dot(X, np.full(len(Y), Y_bar)))
        /(np.dot(X,X) - np.dot(X, np.full(len(Y), X_bar))))
    b = Y_bar - s*X_bar
    return s, b

Y = np.array([2,5,4,10,5,6,8,15,2])
X = np.arange(1, len(Y)+1)

s, b = linear_regression(X,Y)
Y_hat = X*s + b
plt.plot(X,Y_hat)
plt.scatter(X, Y)
```

## What does this look like in **SciPy**?
Well, **SciPy** has its own linear regression function, which works like so:

```python
from scipy import stats
slope, intercept, *rest = stats.linregress(X, Y)
```
Let's check out if the findings match.
```
                Slope		         Intercept
Scipy: 	 0.5666666666666669 	 3.4999999999999987
My func: 0.5666666666666667 	 3.5
```
They do... Cool!
## How about a race?
Let's race the two implementations of linear regression calculations!
```python
from time import time
x = np.random.random(1000000)
y = np.random.random(1000000)
tic = time()
slope, intercept, *rest = stats.linregress(x, y)
toc = time()
print(f"Scipy took: \t{(toc-tic)*1000}ms")

tic = time()
slope, intercept = linear_regression(x, y)
toc = time()
print(f"Our func took: \t{(toc-tic)*1000}ms")
```
```
Scipy took: 	33.461809158325195ms
Our func took: 	9.068489074707031ms
```
#### **Whoa!!!**
Our function took significantly less time! About half... Considering that libraries like **SciPy** are optimized as hell for speed, this is a pretty decent feat!

**Uhmmm,** I guess I might have cheated a little, though. See that `*rest` when I called the **SciPy** function?  
```python
slope, intercept, *rest = stats.linregress(X, Y)
```
Well... That `*rest` contains the results of some other useful calculations like the correlation coefficient, which we didn't calculate at all. So, no wonder **SciPy** took more time!

**Nonetheless,** our function performed comparably to that of **SciPy.** I'll definitely take that as a success!

## Footer
### Some details
* This is for linear regression with a single independent variable.
  * The rationale behind linear regression models with multiple variables is pretty much the same. The math turns out to be a bit more complex with the added "dimensions."