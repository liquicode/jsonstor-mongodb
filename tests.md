```


  jsonstor-mongodb Tests
    A) CRUD Tests
      ✔ should insert 100 documents, one at a time (780ms)
      ✔ should delete 100 documents, all at once (16ms)
      ✔ should insert 100 documents, all at once (18ms)
      ✔ should read 100 documents, one at a time (561ms)
      ✔ should replace 100 documents, one at a time (1267ms)
      ✔ should read 100 documents, all at once (6ms)
      ✔ should update 100 documents, one at a time (709ms)
      ✔ should update 100 documents, all at once (10ms)
      ✔ should delete 100 documents, one at a time (611ms)
    B) Rainbow Tests
      Nested Fields (explicit)
        ✔ should not perform matching on nested fields using implicit $eq
        ✔ should not perform matching on nested fields using explicit $eq
      Nested Fields (dot notation)
        ✔ should perform matching on nested fields using implicit $eq and dot notation
        ✔ should perform matching on nested fields using explicit $eq and dot notation (6ms)
      Operator $eq (===)
        ✔ should perform strict equality (===) on 'bns' (32ms)
        ✔ should perform strict equality (===) on 'o' (10ms)
        ✔ should perform strict equality (===) on 'a' (11ms)
        ✔ should not perform loose equality (==) on 'bns' (31ms)
        ✔ should not perform loose equality (==) on 'o' (10ms)
        ✔ should not perform loose equality (==) on 'a' (10ms)
        ✔ should equate null with an undefined field
      Operator $ne (!==)
        ✔ should perform strict inequality (!==) on 'bns' (35ms)
        ✔ should perform strict inequality (!==) on 'o'
        ✔ should perform strict inequality (!==) on 'a'
        ✔ should not perform loose inequality (!=) on 'bns' (18ms)
        ✔ should not perform loose inequality (!=) on 'o'
        ✔ should not perform loose inequality (!=) on 'a'
      Operator $gte (>=)
        ✔ should perform strict comparison (>=) on 'bns' (31ms)
        ✔ should not perform loose comparison (>=) on 'bns' (14ms)
        ✔ should equate null with an undefined field
      Operator $gt (>)
        ✔ should perform strict comparison (>=) on 'bns' (17ms)
        ✔ should not perform loose comparison (>=) on 'bns' (15ms)
      Operator $lte (<=)
        ✔ should perform strict comparison (<=) on 'bns' (15ms)
        ✔ should not perform loose comparison (<=) on 'bns' (15ms)
        ✔ should equate null with an undefined field
      Operator $lt (<)
        ✔ should perform strict comparison (<) on 'bns' (16ms)
        ✔ should not perform loose comparison (<) on 'bns' (15ms)
    C) UserInfo Permissions Tests
      Alice, Bob, and Eve scenario
        ✔ Should add documents and set permissions (123ms)
        ✔ Alice should read all documents and write all documents (226ms)
        ✔ Bob should read some documents and write some documents (198ms)
        ✔ Eve should read some documents and write some documents (186ms)
        ✔ Public objects should be readable by everyone (126ms)
        ✔ Public objects should only be writable by the owner (151ms)
        ✔ Should not allow readers to update documents (158ms)
    C) MongoDB Tutorial
      Query Documents (https://www.mongodb.com/docs/manual/tutorial/query-documents/)
        Select All Documents in a Collection
          ✔ Match All Documents with an Empty Object {}
        Specify Equality Condition
          ✔ Match Fields with Implicit Equality
        Specify Conditions Using Query Operators
          ✔ Match Fields with an Array of Possible Values
        Specify AND Conditions
          ✔ Match Fields with an Array of Possible Values
        Specify OR Conditions
          ✔ Match Fields against an Array of Possible Values
        Specify AND as well as OR Conditions
          ✔ Match Fields Using AND and OR (6ms)
      Query on Embedded/Nested Documents (https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/)
        Query on Embedded/Nested Documents
          ✔ Specify Equality Match on a Nested Field
          ✔ Specify Match using Query Operator (8ms)
          ✔ Specify AND Condition
        Match an Embedded/Nested Document
          ✔ Specify Equality Match on an Embedded Document (11ms)
      Query an Array (https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
        Match an Array
          ✔ Match an Array Exactly
          ✔ Match Array Elements
        Query an Array for an Element
          ✔ Match a Single Array Element
          ✔ Match Array Elements by Comparison (6ms)
        Specify Multiple Conditions for Array Elements
          ✔ Query an Array with Compound Filter Conditions on the Array Elements
          ✔ Query for an Array Element that Meets Multiple Criteria
          ✔ Query for an Element by the Array Index Position
          ✔ Query an Array by Array Length
      Query an Array of Embedded Documents (https://www.mongodb.com/docs/manual/tutorial/query-array-of-documents/)
        Query for a Document Nested in an Array
          ✔ Match a Document Exactly (6ms)
        Specify a Query Condition on a Field in an Array of Documents
          ✔ Specify a Query Condition on a Field Embedded in an Array of Documents (6ms)
          ✔ Use the Array Index to Query for a Field in the Embedded Document (6ms)
        Specify Multiple Conditions for Array of Documents
          ✔ A Single Nested Document Meets Multiple Query Conditions on Nested Fields (11ms)
          ✔ Combination of Elements Satisfies the Criteria (10ms)
      Query for Null or Missing Fields (https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)
        Equality Filter
          ✔ Match Fields that are Null or Missing
        Type Check
          ✔ Match Fields that Exist And are Null (6ms)
        Existence Check
          ✔ Match Fields that are Missing
    D) MongoDB Reference
      Comparison Query Operators
        Comparison Operator: $eq (https://www.mongodb.com/docs/manual/reference/operator/query/eq/)
          Equals an Array Value
            ✔ Match an Array Element
            ✔ Match an Array Element Using Implicit $eq (6ms)
          Regex Match Behaviour
            ✔ $eq match on a string (10ms)
            ✔ $eq match on a regular expression
            ✔ Use the $in Operator with a Regular Expression (10ms)
        Comparison Operator: $gt (https://www.mongodb.com/docs/manual/reference/operator/query/gt/)
          ✔ Match Document Fields
        Comparison Operator: $gte (https://www.mongodb.com/docs/manual/reference/operator/query/gte/)
          ✔ Match Document Fields
        Comparison Operator: $in (https://www.mongodb.com/docs/manual/reference/operator/query/in/)
          ✔ Use the $in Operator to Match Values (6ms)
          ✔ Use the $in Operator to Match Values in an Array
          ✔ Use the $in Operator with a Regular Expression
        Comparison Operator: $lt (https://www.mongodb.com/docs/manual/reference/operator/query/lt/)
          ✔ Match Document Fields
        Comparison Operator: $lte (https://www.mongodb.com/docs/manual/reference/operator/query/lte/)
          ✔ Match Document Fields
        Comparison Operator: $ne (https://www.mongodb.com/docs/manual/reference/operator/query/ne/)
          ✔ Match Document Fields
        Comparison Operator: $nin (https://www.mongodb.com/docs/manual/reference/operator/query/nin/)
          ✔ Select on Unmatching Documents
          ✔ Select on Elements Not in an Array (6ms)
      Logical Query Operators
        Logical Operator: $and (https://www.mongodb.com/docs/manual/reference/operator/query/and/)
          ✔ AND Queries With Multiple Expressions Specifying the Same Field (11ms)
          ✔ AND Queries With Multiple Expressions Specifying the Same Operator
        Logical Operator: $not (https://www.mongodb.com/docs/manual/reference/operator/query/not/)
          ✔ Match Document Fields
          ✔ $not and Regular Expressions (15ms)
        Logical Operator: $nor (https://www.mongodb.com/docs/manual/reference/operator/query/nor/)
          ✔ $nor Query with Two Expressions (6ms)
          ✔ $nor and Additional Comparisons (6ms)
          ✔ $nor and $exists (6ms)
        Logical Operator: $or (https://www.mongodb.com/docs/manual/reference/operator/query/or/)
          ✔ Match Document Fields
          ✔ $or versus $in (12ms)
          ✔ Nested $or Clauses
      Element Query Operators
        Element Query Operator: $exists (https://www.mongodb.com/docs/manual/reference/operator/query/exists/)
          ✔ Exists and Not Equal To (51ms)
          ✔ Null Values (62ms)
        Element Query Operator: $type (https://www.mongodb.com/docs/manual/reference/operator/query/type/)
          ✔ Querying by Data Type (BSON Code) (10ms)
          ✔ Querying by Data Type (BSON Alias) (10ms)
          ✔ Querying by Data Type ("number")
          ✔ Querying by Multiple Data Type (BSON Code) (60ms)
          ✔ Querying by Multiple Data Type (BSON Alias) (70ms)
      Array Query Operators
        Array Query Operator: $all (https://www.mongodb.com/docs/manual/reference/operator/query/all/)
          ✔ Use $all to Match Values (6ms)
          ✔ Use $all with $elemMatch
          ✔ Use $all with Scalar Values
        Array Query Operator: $elemMatch (https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/)
          ✔ Element Match (36ms)
          ✔ Array of Embedded Documents (37ms)
          ✔ Single Query Condition (49ms)
        Array Query Operator: $size (https://www.mongodb.com/docs/manual/reference/operator/query/size/)
          ✔ Use $size to Match Array Sizes (63ms)
    Z) Ad-Hoc Tests
      ✔ should not match explicit nested fields (52ms)


  109 passing (7s)

```
