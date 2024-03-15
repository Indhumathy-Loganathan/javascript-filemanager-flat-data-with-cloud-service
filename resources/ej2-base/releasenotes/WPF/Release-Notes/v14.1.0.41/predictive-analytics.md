## Predictive Analytics

### Feature
{:#predictive-analytics-feature}

* Added experimental support for PMML files generated by SAS for the following models:

* Association Rules
* Clustering model
* Neural network model
* Regression model
* Tree model

* Added support to provide input data as “ExpandoObject” and “Dictionary” object in GetResult() method.

* Added support to provide input PMML file as “TextReader” object for PMML Evaluator.

* Added support to perform PMML Schema validation on input PMML.

* Tree model result returns “Predicted node” and “path” ID with predicted result.

* Association rules model result returns “Confidence” value.